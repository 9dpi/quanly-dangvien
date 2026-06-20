/**
 * Code.gs - Google Apps Script backend for QLĐV System.
 * 
 * This script handles all interactions between the Web Frontend and the Google Sheet Database.
 * The Spreadsheet ID is: 1RrJHVmp5A_jL9BVq1vgXkBeORNU59OaFz3-rkU8BJKY
 */

// --- CONFIGURATION ---
const SPREADSHEET_ID = "1RrJHVmp5A_jL9BVq1vgXkBeORNU59OaFz3-rkU8BJKY";
const SHEET_NAME_DANHVIEN = "DanhSachDangVien"; // Thay thế bằng tên Sheet thực tế
const SHEET_NAME_LOG = "SystemLogs";         // Sheet để ghi nhật ký hệ thống

/**
 * Lấy đối tượng Spreadsheet và Sheet cụ thể.
 * @returns {GoogleAppsScript.Spreadsheet.Sheet} Đối tượng Sheet cần thao tác.
 */
function getTargetSheet() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    // Kiểm tra xem sheet có tồn tại không trước khi trả về
    const sheet = ss.getSheetByName(SHEET_NAME_DANHVIEN); 
    if (!sheet) {
      throw new Error(`Không tìm thấy Sheet với tên: ${SHEET_NAME_DANHVIEN}`);
    }
    return sheet;
  } catch (e) {
    Logger.log("Lỗi khi truy cập Spreadsheet hoặc Sheet: " + e.toString());
    throw new Error("Lỗi cấu hình hệ thống: Không thể kết nối đến Google Sheet.");
  }
}

/**
 * Hàm doGet() được gọi khi triển khai Web App, dùng để trả về giao diện HTML cho Frontend.
 * @param {GoogleAppsScript.Events.DoGet} e Sự kiện kích hoạt (nếu có).
 * @returns {GoogleAppsScript.HTML.HtmlOutput} Nội dung trang web.
 */
function doGet(e) {
  // Giả sử bạn sẽ tạo một file HTML tên là 'Index' trong thư mục này
  const html = HtmlService.createTemplateFromFile('Index').evaluate();
  return html;
}

/**
 * Lấy toàn bộ dữ liệu từ Sheet Đảng viên (DanhSachDangVien).
 * @returns {Array<Array<any>>} Mảng 2D chứa tất cả các hàng và cột dữ liệu.
 */
function getAllDangVienData() {
  try {
    const sheet = getTargetSheet();
    // Giả sử dòng đầu tiên là tiêu đề, nên bắt đầu từ dòng 2 (range: A2:Z)
    const range = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn());
    return range.getValues();
  } catch (e) {
    Logger.log("Lỗi khi lấy dữ liệu Đảng viên: " + e.toString());
    throw new Error("Không thể truy xuất dữ liệu đảng viên.");
  }
}

/**
 * Thêm một bản ghi mới vào Sheet Đảng viên.
 * @param {Object} data - Đối tượng chứa dữ liệu cần thêm (phải có đủ 8 trường).
 * @returns {boolean} Trả về true nếu thành công, false nếu thất bại.
 */
function addDangVienRecord(data) {
  try {
    const sheet = getTargetSheet();
    // Lấy các giá trị theo đúng thứ tự cột đã định nghĩa:
    const rowData = [
      data.maDangVien || "", 
      data.hoTen || "", 
      data.ngaySinh || "", 
      data.gioiTinh || "", 
      data.queQuan || "", 
      data.trinhDoChuyenMon || "", 
      data.chucVu || "", 
      data.donViCongTac || ""
    ];

    sheet.appendRow(rowData);
    return true;
  } catch (e) {
    Logger.log("Lỗi khi thêm bản ghi: " + e.toString());
    throw new Error("Thao tác thêm bản ghi thất bại.");
  }
}

/**
 * Thêm hàng loạt bản ghi vào Sheet Đảng viên.
 * @param {Array<Object>} records - Danh sách các đối tượng chứa dữ liệu cần thêm.
 * @returns {boolean} Trả về true nếu thành công.
 */
function addDangVienRecordBatch(records) {
  try {
    if (!records || records.length === 0) return true;
    const sheet = getTargetSheet();
    const rows = records.map(data => [
      data.maDangVien || "", 
      data.hoTen || "", 
      data.ngaySinh || "", 
      data.gioiTinh || "", 
      data.queQuan || "", 
      data.trinhDoChuyenMon || "", 
      data.chucVu || "", 
      data.donViCongTac || ""
    ]);
    
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow + 1, 1, rows.length, rows[0].length).setValues(rows);
    return true;
  } catch (e) {
    Logger.log("Lỗi khi thêm loạt bản ghi: " + e.toString());
    throw new Error("Thao tác thêm loạt bản ghi thất bại: " + e.message);
  }
}

/**
 * Cập nhật một bản ghi Đảng viên dựa trên Mã Đảng viên.
 * @param {Object} data - Đối tượng chứa dữ liệu cần cập nhật.
 * @returns {boolean} Trả về true nếu cập nhật thành công.
 */
function updateDangVienRecord(data) {
  try {
    const sheet = getTargetSheet();
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) throw new Error("Bảng dữ liệu rỗng.");
    
    const codes = sheet.getRange(2, 1, lastRow - 1, 1).getValues().map(row => row[0].toString().trim());
    const searchCode = data.maDangVien.toString().trim();
    const index = codes.indexOf(searchCode);
    
    if (index === -1) {
      throw new Error(`Không tìm thấy đảng viên có mã: ${searchCode}`);
    }
    
    const targetRow = index + 2;
    const rowValues = [[
      data.maDangVien || "", 
      data.hoTen || "", 
      data.ngaySinh || "", 
      data.gioiTinh || "", 
      data.queQuan || "", 
      data.trinhDoChuyenMon || "", 
      data.chucVu || "", 
      data.donViCongTac || ""
    ]];
    
    sheet.getRange(targetRow, 1, 1, rowValues[0].length).setValues(rowValues);
    return true;
  } catch (e) {
    Logger.log("Lỗi khi cập nhật bản ghi: " + e.toString());
    throw new Error("Cập nhật bản ghi thất bại: " + e.message);
  }
}

/**
 * Xóa một bản ghi Đảng viên dựa trên Mã Đảng viên.
 * @param {string} maDangVien - Mã đảng viên cần xóa.
 * @returns {boolean} Trả về true nếu xóa thành công.
 */
function deleteDangVienRecord(maDangVien) {
  try {
    const sheet = getTargetSheet();
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) throw new Error("Bảng dữ liệu rỗng.");
    
    const codes = sheet.getRange(2, 1, lastRow - 1, 1).getValues().map(row => row[0].toString().trim());
    const searchCode = maDangVien.toString().trim();
    const index = codes.indexOf(searchCode);
    
    if (index === -1) {
      throw new Error(`Không tìm thấy đảng viên có mã: ${searchCode}`);
    }
    
    const targetRow = index + 2;
    sheet.deleteRow(targetRow);
    return true;
  } catch (e) {
    Logger.log("Lỗi khi xóa bản ghi: " + e.toString());
    throw new Error("Xóa bản ghi thất bại: " + e.message);
  }
}

/**
 * [Placeholder] Hàm xử lý logic nghiệp vụ phức tạp, ví dụ: Kiểm tra tính hợp lệ của dữ liệu nhập từ Excel.
 * @param {Array<Object>} excelData - Dữ liệu được parse từ file Excel (nếu cần).
 * @returns {boolean} Trả về true nếu tất cả dữ liệu hợp lệ.
 */
function validateAndProcessExcelData(excelData) {
  if (!excelData || excelData.length === 0) {
    throw new Error("Không có dữ liệu nào được cung cấp để xử lý.");
  }

  Logger.log(`Bắt đầu quy trình xử lý và xác thực ${excelData.length} bản ghi từ Excel...`);
  let validCount = 0;
  let invalidRecords = [];

  for (let i = 0; i < excelData.length; i++) {
    const record = excelData[i];
    // Giả định cấu trúc dữ liệu trong excelData đã được parse thành các trường:
    const maDangVien = record.MaDangVien || "";
    const hoTen = record.HoTen || "";
    const ngaySinh = record.NgaySinh || "";

    // --- Bắt đầu logic kiểm tra (Validation Logic) ---
    let isValid = true;
    let errorMessages = [];

    if (!maDangVien) {
      errorMessages.push("Mã Đảng viên không được để trống.");
      isValid = false;
    }
    if (!hoTen || hoTen.trim() === "") {
      errorMessages.push("Họ và Tên là trường bắt buộc.");
      isValid = false;
    }
    // Thêm các kiểm tra khác (ví dụ: định dạng ngày sinh, giới tính hợp lệ...)

    if (isValid) {
      validCount++;
    } else {
      invalidRecords.push({
        row: i + 2, // Dòng thứ hai là bản ghi đầu tiên
        data: record,
        errors: errorMessages.join(", ")
      });
    }
  }

  // Ghi nhật ký kết quả xử lý
  Logger.log(`--- Báo cáo Xử lý Excel ---`);
  Logger.log(`Tổng số bản ghi đã kiểm tra: ${excelData.length}`);
  Logger.log(`Số bản ghi hợp lệ (sẵn sàng nhập): ${validCount}`);
  Logger.log(`Số bản ghi bị lỗi: ${invalidRecords.length}`);

  if (invalidRecords.length > 0) {
    // Trong thực tế, bạn sẽ trả về danh sách này cho người dùng xem và sửa chữa
    throw new Error(`Xử lý hoàn tất với cảnh báo: ${invalidRecords.length} bản ghi bị lỗi. Vui lòng kiểm tra log để biết chi tiết.`);
  }

  return true; // Trả về true nếu không có lỗi nghiêm trọng nào xảy ra trong quá trình xử lý
}

/**
 * Khởi tạo tiêu đề cột (Headers) cho Sheet Đảng viên nếu chưa tồn tại.
 * Hàm này nên được gọi lần đầu tiên khi thiết lập hệ thống để đảm bảo cấu trúc bảng chuẩn hóa.
 */
function initializeSheetHeaders() {
  try {
    const sheet = getTargetSheet();
    // Định nghĩa các tiêu đề cột theo thứ tự logic của hệ thống QLĐV
    const requiredHeaders = [
      "Mã Đảng viên", 
      "Họ và Tên", 
      "Ngày Sinh", 
      "Giới Tính", 
      "Quê Quán", 
      "Trình Độ Chuyên Môn", 
      "Chức Vụ Hiện Tại", 
      "Đơn Vị Công Tác",
      // ... Thêm các trường dữ liệu khác theo yêu cầu nghiệp vụ
    ];

    // Lấy hàng tiêu đề hiện tại (Giả sử dòng 1 là header)
    const existingHeaders = sheet.getRange(1, 1, 1, requiredHeaders.length).getValues()[0];
    
    // Kiểm tra xem hàng tiêu đề đã được điền đầy đủ và đúng chưa
    let headersMatch = true;
    for (let i = 0; i < requiredHeaders.length; i++) {
      if (!existingHeaders[i] || existingHeaders[i].toString().trim() !== requiredHeaders[i]) {
        headersMatch = false;
        break;
      }
    }

    if (!headersMatch) {
      // Ghi đè/Thiết lập các tiêu đề cột chuẩn vào dòng 1
      sheet.getRange(1, 1, 1, requiredHeaders.length).setValues([requiredHeaders]);
      Logger.log("✅ Đã khởi tạo thành công các tiêu đề cột cho Sheet Đảng viên.");
    } else {
      Logger.log("ℹ️ Các tiêu đề cột đã tồn tại và khớp với cấu trúc yêu cầu.");
    }

  } catch (e) {
    Logger.log("❌ Lỗi khi khởi tạo tiêu đề: " + e.toString());
    throw new Error("Không thể kiểm tra hoặc thiết lập tiêu đề Sheet. Vui lòng kiểm tra quyền truy cập và ID Spreadsheet.");
  }
}