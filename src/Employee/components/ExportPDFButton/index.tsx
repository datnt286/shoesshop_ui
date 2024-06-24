import React from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

interface TableDefinition {
    headerRows: number;
    widths: (string | number)[];
    body: (string | number)[][];
}

interface DocumentDefinition {
    content: {
        table: TableDefinition;
    }[];
}

const ExportPDFButton: React.FC<{ data: any[] }> = ({ data }) => {
    const handleExportPDF = () => {
        const tableBody: (string | number)[][] = data.map((item: any) =>
            Object.values(item).map((value) => {
                if (typeof value === 'string' || typeof value === 'number') {
                    return value;
                }
                return '';
            }),
        );

        const documentDefinition: DocumentDefinition = {
            content: [
                {
                    table: {
                        headerRows: 1,
                        widths: Array(Object.keys(data[0]).length).fill('*'),
                        body: [Object.keys(data[0]), ...tableBody],
                    },
                },
            ],
        };

        pdfMake.createPdf(documentDefinition).download('data.pdf');
    };

    return (
        <button className="btn btn-gray btn-sm" onClick={handleExportPDF}>
            Xuất PDF
        </button>
    );
};

export default ExportPDFButton;
