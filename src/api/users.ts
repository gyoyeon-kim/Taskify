import axiosInstance from "./axiosInstance";
import { apiRoutes } from "./apiRoutes";
import { UpdateUser, UserMeImage } from "@/types/users";
import { UserType } from "@/types/users";

interface SignUpRequest {
  email: string;
  nickname: string;
  password: string;
}

// 회원가입 (POST)
export const signUp = async ({
  payload,
}: {
  teamId: string;
  payload: SignUpRequest;
}) => {
  const response = await axiosInstance.post<SignUpRequest>(
    apiRoutes.users(),
    payload
  );
  return response.data;
};

// 내 정보 조회 (GET)
export const getUserInfo = async () => {
  const response = await axiosInstance.get<UserType>(apiRoutes.usersMe());
  return response.data;
};

// 내 정보 수정 (PUT)
export const updateProfile = async (data: UpdateUser) => {
  const res = await axiosInstance.put(apiRoutes.usersMe(), data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

// 프로필 이미지 업로드 (POST)
export const uploadProfileImage = async (
  formData: FormData
): Promise<UserMeImage> => {
  const response = await axiosInstance.post(apiRoutes.userMeImage(), formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
