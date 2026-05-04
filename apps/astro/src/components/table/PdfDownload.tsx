import html2canvas from "html2canvas";
import { jsPDF as JsPDF } from "jspdf";

const DownloadPDFButton = () => {
  const handleDownloadPDF = async () => {
    const dashboardElement = document.getElementById("dashboard");
    if (!dashboardElement) return;

    const canvas = await html2canvas(dashboardElement);
    const imgData = canvas.toDataURL("image/jpeg", 0.75);

    const pdf = new JsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height);
    pdf.save("dashboard.pdf");
  };

  return (
    <button type="submit" onClick={handleDownloadPDF}>
      Download PDF
    </button>
  );
};

export default DownloadPDFButton;
