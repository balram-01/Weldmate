interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    phone: string;
    role: string;
    status: string;
    created_at: string;
    updated_at: string;
  };
}

type LoginApiArgs = {email: string, password: string};

interface FCMArgs {
  fcmToken: string;
}

export type { LoginResponse, LoginApiArgs, FCMArgs };
