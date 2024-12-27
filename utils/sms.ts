export async function sendSMSToken(phone: string, token: string): Promise<void> {
    console.log(`Token ${token} sent to phone: ${phone}`);
}