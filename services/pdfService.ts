
export const extractTextFromPdf = async (file: File, startPage: number, endPage: number): Promise<string | null> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
            if (!event.target?.result) {
                return reject(new Error("Failed to read PDF file."));
            }
            try {
                const pdf = await window.pdfjsLib.getDocument(event.target.result).promise;
                
                if (startPage < 1 || endPage > pdf.numPages || startPage > endPage) {
                    return reject(new Error("محدوده صفحات نامعتبر است."));
                }

                let texts: string[] = [];
                for (let i = startPage; i <= endPage; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map((item: any) => item.str).join(' ');
                    texts.push(pageText);
                }
                resolve(texts.join('\n\n'));
            } catch (error) {
                console.error("Error processing PDF:", error);
                reject(new Error("خطا در پردازش صفحات PDF."));
            }
        };
        reader.onerror = () => reject(new Error("Error reading file."));
        reader.readAsArrayBuffer(file);
    });
};
