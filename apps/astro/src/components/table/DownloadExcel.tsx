import { format } from "date-fns";
import * as XLSX from "xlsx";

type ExportToExcelButtonProps<T> = {
  data: Array<T>;
};

const ExportToExcelButton = <T,>({ data }: ExportToExcelButtonProps<T>) => {
  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const formattedDate = format(new Date(), "yyyy-MM-dd");
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const fileName = `insights_report_${formattedDate}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  return (
    <button type="button" onClick={handleExport}>
      Export to Excel
    </button>
  );
};

export default ExportToExcelButton;
