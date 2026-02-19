export const checkExists = (obj: Record<string, any>, param: any) => {
    const result = param in obj;

    return result;
};
