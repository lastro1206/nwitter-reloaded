import styled from "styled-components";
import type { ITweet } from "./Timeline";
import { auth, db } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useState } from "react";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
  object-fit: cover;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
  align-self: flex-start;
`;

const TextArea = styled.textarea`
  border: 2px solid white;
  border-radius: 10px;
  margin-top: 10px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 90%;
  resize: none;
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    "Open Sans",
    "Helvetica Neue",
    sans-serif;
  align-self: flex-start;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
  align-self: flex-start;
`;

const CommonButton = styled.button`
  border: 0;
  height: 23.33px;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
`;

const DeleteButton = styled(CommonButton)`
  background-color: tomato;
  color: white;
`;

const EditButton = styled(CommonButton)`
  background-color: #10b981;
  color: white;
  margin-left: 5px;
`;

const CancelButton = styled(CommonButton)`
  background-color: tomato;
  color: white;
  margin: 10px;
`;

const PhotoActionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
  width: 100%;
`;

const UploadLabel = styled.label`
  background-color: #10b981;
  height: 23.3333px;
  color: white;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
`;

const RemovePhotoButton = styled(CommonButton)`
  background-color: tomato;
  color: white;
`;

export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
  const user = auth.currentUser;
  const [isEditing, setIsEditing] = useState(false);
  const [editedTweet, setEditedTweet] = useState(tweet);
  const [editedPhoto, setEditedPhoto] = useState<string | null>(photo || null);

  const onToggleEdit = () => {
    if (isEditing) {
      setEditedTweet(tweet);
      setEditedPhoto(photo || null);
    }
    setIsEditing((prev) => !prev);
  };

  const onSave = async () => {
    if (user?.uid !== userId) return;
    try {
      await updateDoc(doc(db, "tweets", id), {
        tweet: editedTweet,
        photo: editedPhoto,
      });
      setIsEditing(false);
    } catch (e) {
      console.error(e);
    }
  };

  const onDelete = async () => {
    const ok = confirm("Are you sure you want to delete this tweet?");
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
    } catch (e) {
      console.log(e);
    }
  };

  const onDeletePhoto = () => {
    const ok = confirm("Are you sure you want to delete this photo?");
    if (ok) setEditedPhoto(null);
  };

  const onPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      const file = files[0];
      if (file.size > 1 * 1024 * 1024) {
        alert("사진은 1MB를 초과할 수 없습니다.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        {isEditing ? (
          <TextArea
            required
            value={editedTweet}
            onChange={(e) => setEditedTweet(e.target.value)}
          />
        ) : (
          <Payload>{tweet}</Payload>
        )}
        {user?.uid === userId && (
          <div style={{ marginTop: 10, alignSelf: "flex-start" }}>
            {isEditing ? (
              <>
                <EditButton
                  onClick={onSave}
                  style={{ marginLeft: 0, marginRight: 5 }}>
                  Save
                </EditButton>
                <CancelButton
                  onClick={onToggleEdit}
                  style={{ margin: 0 }}>
                  Cancel
                </CancelButton>
              </>
            ) : (
              <>
                <DeleteButton onClick={onDelete}>Delete</DeleteButton>
                <EditButton onClick={onToggleEdit}>Edit</EditButton>
              </>
            )}
          </div>
        )}
      </Column>

      <Column>
        {(isEditing ? editedPhoto : photo) && (
          <Photo src={isEditing ? editedPhoto! : photo} />
        )}

        {isEditing && (
          <PhotoActionsWrapper>
            <UploadLabel htmlFor={`photo-input-${id}`}>Edit Photo</UploadLabel>
            <input
              id={`photo-input-${id}`}
              type='file'
              accept='image/*'
              onChange={onPhotoChange}
              style={{ display: "none" }}
            />

            {editedPhoto && (
              <RemovePhotoButton onClick={onDeletePhoto}>
                Delete Photo
              </RemovePhotoButton>
            )}
          </PhotoActionsWrapper>
        )}
      </Column>
    </Wrapper>
  );
}
