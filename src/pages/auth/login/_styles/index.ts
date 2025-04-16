import styled from '@emotion/styled';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f7fafc;
`;

const LoginCard = styled.div`
  width: 100%;
  max-width: 400px;
  background-color: white;
  border-radius: 20px;
  box-shadow:
    0 4px 6px rgba(0, 0, 0, 0.1),
    0 1px 3px rgba(0, 0, 0, 0.05);
  padding: 24px;
`;

const LoginTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 20px;
  text-align: center;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  row-gap: 20px;
  width: 100%;
`;

const AuthLoginComponents = {
  LoginContainer,
  LoginCard,
  LoginTitle,
  LoginForm,
};

export default AuthLoginComponents;
