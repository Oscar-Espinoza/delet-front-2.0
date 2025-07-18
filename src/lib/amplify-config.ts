import { Amplify } from 'aws-amplify'

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID,
      region: import.meta.env.VITE_AWS_REGION,
      signUpVerificationMethod: 'code' as const,
      loginWith: {
        email: true,
        phone: false,
        username: false,
      },
    },
  },
}

export const configureAmplify = () => {
  Amplify.configure(amplifyConfig)
}

export default amplifyConfig
