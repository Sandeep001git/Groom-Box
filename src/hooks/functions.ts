
export const openMediaDevices = async (constraints:Object) => {
    return await navigator.mediaDevices.getUserMedia(constraints);
}