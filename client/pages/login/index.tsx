import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    console.log(email, password);
    // let response = await axios.post('/user', {
    //   email,
    //   password,
    // });
    let response = await fetch('http://localhost:3001/api/users/login', {
      method: 'POST',
      credentials: 'include', // Don't forget to specify this if you need cookies
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    let data = await response.json();
    router.push('http://localhost:3000/me');
    console.log(data);
  };

  return (
    <div className="flex flex-1 flex-col gap-3 justify-center items-center bg-slate-500">
      <input
        type="text"
        value={email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setEmail(e.target.value);
        }}
      />
      <input
        type="password"
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setPassword(e.target.value);
        }}
      />

      <button
        onClick={() => {
          handleSubmit();
        }}
      >
        login
      </button>
    </div>
  );
};

export default Login;
