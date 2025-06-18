export const retry = async (fn, maxRetries = 3, delay = 1000) => {
    let lastError;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = error;
            if (attempt === maxRetries) {
                throw lastError;
            }
            await new Promise((resolve) => setTimeout(resolve, delay * attempt));
        }
    }
    throw lastError;
};
//# sourceMappingURL=retry.js.map