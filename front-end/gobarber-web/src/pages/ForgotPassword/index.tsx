import React, { useRef, useCallback, useState } from 'react';
import { FiLogIn, FiMail } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { Link } from 'react-router-dom';

import * as Yup from 'yup';
import getValidationErrors from '~/utils/getValidationErrors';

import api from '~/services/api';

import { useToast } from '~/hooks/ToastContext';

import IForgotPasswordFormData from './interfaces/IForgotPasswordFormData';

import Input from '~/components/Input';
import Button from '~/components/Button';

import logoImg from '~/assets/logo.svg';

import { Container, Content, AnimationContainer, Background } from './styles';

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: IForgotPasswordFormData) => {
      try {
        setLoading(true);

        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/password/forgot', {
          email: data.email,
        });

        addToast({
          type: 'success',
          title: 'E-mail de recupereção enviado',
          description:
            'Enviamos um e-mail para sua caixa de entrada com as instruções para recuperar a sua senha',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na recuperação de senha',
          description:
            'Ocorreu um erro ao tentar realizar a recuperação de senha, tente novamente.',
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="Go Barber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recuperar Senha</h1>

            <Input
              name="email"
              type="email"
              placeholder="E-mail"
              icon={FiMail}
            />

            <Button type="submit" loading={loading}>
              Recuperar
            </Button>
          </Form>

          <Link to="/">
            <FiLogIn />
            Voltar ao Login
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ForgotPassword;