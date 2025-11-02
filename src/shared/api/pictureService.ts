import avatarDefault from "@/shared/assets/images/avatar-default.png";
const apiUrl = import.meta.env.VITE_API_URL;

export const pictureService = {
    fetchPicture(pictureId: string | undefined) {
        try {

            if (!pictureId) return avatarDefault;
            const urlRegex = /^https?:\/\S+$/;
            if (urlRegex.test(pictureId)) {
                return pictureId
            }
            const response = `${apiUrl}/picture/${pictureId}`;
            return response;
        } catch (error) {
            return avatarDefault;
        }
    }
}