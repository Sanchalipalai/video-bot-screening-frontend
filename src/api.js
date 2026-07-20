const API_URL = "import.meta.env.VITE_API_URL";


export async function getCandidates() {

    const response = await fetch(
        `${API_URL}/api/candidates`
    );

    return await response.json();
}


export async function uploadVideo(file) {

    const formData = new FormData();

    formData.append(
        "file",
        file
    );


    const response = await fetch(
        `${API_URL}/api/upload-video`,
        {
            method: "POST",
            body: formData
        }
    );


    return await response.json();
}


export async function getScreening(candidateId) {

    const response = await fetch(
        `${API_URL}/api/candidate/${candidateId}/screening`
    );

    return await response.json();
}