import { useState } from "react";
import {
  Input,
  MissingPasswordButton,
  Title,
  Wrapper,
} from "../components/auth-components";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { Form } from "react-router-dom";

export default function ChangePassword() {
  const [email, setEmail] = useState("");
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "email") setEmail(value);
  };

  const onClick = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Wrapper>
      <Title>Input your Email</Title>
      <Form
        style={{
          marginTop: "50px",
        }}>
        <Input
          onChange={onChange}
          name='email'
          placeholder='Email'
          value={email}
          type='email'
          required
        />
        <MissingPasswordButton onClick={onClick}>
          Send to email
        </MissingPasswordButton>
      </Form>
    </Wrapper>
  );
}
