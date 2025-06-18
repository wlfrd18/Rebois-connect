import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [serverMessage, setServerMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    firstName: Yup.string().required('Le prénom est requis'),
    lastName: Yup.string().required('Le nom est requis'),
    email: Yup.string().email('Email invalide').required('Email requis'),
    phone: Yup.string().required('Numéro de téléphone requis'),
    password: Yup.string().min(8, 'Minimum 8 caractères').required('Mot de passe requis'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Les mots de passe ne correspondent pas')
      .required('Confirmez le mot de passe'),
    role: Yup.string()
      .oneOf(['volunteer', 'sponsor', 'tech_structure', 'superuser'], 'Rôle invalide')
      .required('Le rôle est requis'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setError(null);
    setServerMessage(null);
    try {
      const payload = {
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        phone: values.phone,
        password: values.password,
        role: values.role,
      };

      const response = await axios.post('/auth/register', payload);

      if (response.status === 201) {
        setServerMessage(
          "Inscription réussie ! Un lien d'activation vous a été envoyé par email. Veuillez vérifier votre boîte mail."
        );
      }

        setTimeout(() => {
          navigate('/');
        }, 3000);
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        setError(JSON.stringify(err.response.data.errors));
      } else {
        setError('Erreur inconnue');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-greenvegetal">Créer un compte</h2>

        {serverMessage && <p className="mb-4 text-green-700">{serverMessage}</p>}
        {error && <p className="mb-4 text-red-600">{error}</p>}

        {!serverMessage && (
          <Formik
            initialValues={{
              firstName: '',
              lastName: '',
              email: '',
              phone: '',
              password: '',
              confirmPassword: '',
              role: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                {/* ... mêmes champs que précédemment ... */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1 text-black">Prénom</label>
                  <Field name="firstName" className="w-full p-2 border rounded" />
                  <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1 text-black">Nom</label>
                  <Field name="lastName" className="w-full p-2 border rounded" />
                  <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1 text-black">Email</label>
                  <Field type="email" name="email" className="w-full p-2 border rounded" />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1 text-black">Téléphone</label>
                  <Field name="phone" className="w-full p-2 border rounded" />
                  <ErrorMessage name="phone" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1 text-black">Mot de passe</label>
                  <Field type="password" name="password" className="w-full p-2 border rounded" />
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1 text-black">Confirmer le mot de passe</label>
                  <Field type="password" name="confirmPassword" className="w-full p-2 border rounded" />
                  <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1 text-black">Rôle</label>
                  <Field as="select" name="role" className="w-full p-2 border rounded">
                    <option value="">Sélectionnez un rôle</option>
                    <option value="volunteer">Volontaire</option>
                    <option value="sponsor">Sponsor</option>
                    <option value="tech_structure">Structure Technique</option>
                  </Field>
                  <ErrorMessage name="role" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-greenvegetal text-white px-4 py-2 rounded hover:bg-green-700 w-full"
                >
                  S’inscrire
                </button>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

export default Register;

