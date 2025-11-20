import { instance } from "api/instance";
import { TemplateListResponse } from "api/type";
import { ACCESS_TOKEN_KEY } from "utils/keys";

export const getTemplateList = async (typeName: string) => {
  const response = await instance.get<TemplateListResponse>(
    `/maths/templates?typeName=${typeName}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY) || ""}`,
      },
    }
  );
  return response.data;
};

export const postTemplateParam = async (mathId: number, templateId: number) => {
  const response = await instance.post(
    `/maths/parameters/${mathId}?templateId=${templateId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY) || ""}`,
      },
    }
  );
  return response.data
};
