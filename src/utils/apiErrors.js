export const getApiErrorMessage = (error, fallbackMessage) => {
  const data = error?.response?.data;

  if (typeof data?.detail === 'string' && data.detail.trim()) {
    return data.detail;
  }

  if (typeof data?.title === 'string' && data.title.trim() && !data?.errors) {
    return data.title;
  }

  const validationErrors = data?.errors
    ? Object.values(data.errors)
        .flat()
        .filter((message) => typeof message === 'string' && message.trim())
    : [];

  if (validationErrors.length > 0) {
    return validationErrors[0];
  }

  return fallbackMessage;
};
