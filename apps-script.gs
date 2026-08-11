function doPost(e) {
  var SPREADSHEET_ID = "1jbaA8d5pVgedKK9ZKAY3uQTd5Bt_7rslCovVksqsNEA";
  var SHEET_NAME = "신청자명단";
  var CAR_NUMBER_REGEX = /^(?:[가-힣]{2,3}\s?)?\d{2,3}\s?[가-힣]\s?\d{4}$/;

  var p = e.parameter;
  var valetInUse = p.valet === "이용";
  var carNumber = (p.carNumber || "").trim();

  if (!p.name || !p.affiliation || !p.position || !p.phone || !p.email) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", message: "필수 입력 항목이 누락되었습니다." }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  if (valetInUse && !carNumber) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", message: "발렛 이용 시 차량번호를 입력해 주세요." }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  if (carNumber && !CAR_NUMBER_REGEX.test(carNumber)) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", message: "차량번호 형식을 확인해 주세요." }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["제출시각", "참석자명", "소속", "직책/직급", "연락처", "회사 메일", "차량번호", "발렛유무", "음식 알러지"]);
    sheet.setFrozenRows(1);
  }

  sheet.appendRow([
    new Date(),
    p.name || "",
    p.affiliation || "",
    p.position || "",
    p.phone || "",
    p.email || "",
    p.carNumber || "",
    p.valet || "",
    p.foodAllergy || ""
  ]);

  if (p.email) {
    try {
      var mapLink = "https://naver.me/FfeOl1Zs";
      var calendarLink = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
        "&text=" + encodeURIComponent("2026 AI 인재전략 조찬포럼") +
        "&dates=20260907T223000Z/20260908T010000Z" +
        "&location=" + encodeURIComponent("포시즌스 호텔 서울 ARA I+II (6층), 서울 종로구 새문안로 97") +
        "&details=" + encodeURIComponent("문의: 02-2075-1091 / yrna@wjthinkbig.com");

      var subject = "[2026 AI 인재전략 조찬포럼] 참가 신청이 접수되었습니다";

      function row(label, value) {
        var out = "<tr>";
        out += "<td style=" + "\"padding:12px 10px;border-bottom:1px solid #eee;color:#888;width:110px;vertical-align:top;\"" + ">" + label + "</td>";
        out += "<td style=" + "\"padding:12px 10px;border-bottom:1px solid #eee;color:#222;\"" + ">" + value + "</td>";
        out += "</tr>";
        return out;
      }

      var linkStyle = "color:#4a6cf7;text-decoration:none;white-space:nowrap;";
      var rowStyle = "white-space:nowrap;";

      var scheduleLink = "<a style=" + "\"" + linkStyle + "\"" + " href=" + "\"" + calendarLink + "\"" + ">구글캘린더에 추가</a>";
      var placeLink = "<a style=" + "\"" + linkStyle + "\"" + " href=" + "\"" + mapLink + "\"" + ">장소확인</a>";

      var htmlBody = "";
      htmlBody += "<div style=" + "\"font-family:sans-serif;color:#222;max-width:560px;margin:0 auto;\"" + ">";
      htmlBody += "<p style=" + "\"font-size:16px;line-height:1.7;\"" + "><strong>" + p.name + "</strong>님,<br>";
      htmlBody += "신청하신 <strong>2026 AI 인재전략 조찬포럼</strong> 행사에 참가 신청이 접수되었습니다.</p>";
      htmlBody += "<p style=" + "\"font-size:13px;color:#888;margin:0 0 8px;\"" + ">행사 참가를 위해 시간과 장소를 한 번 더 확인해 주세요.</p>";
      htmlBody += "<table style=" + "\"width:100%;border-collapse:collapse;margin:12px 0 24px;font-size:14px;\"" + ">";
      htmlBody += row("행사명", "2026 AI 인재전략 조찬포럼");
      htmlBody += row("행사일시", "<span style=" + "\"" + rowStyle + "\"" + ">2026.09.08(화) 07:30 ~ 10:00</span><br>" + scheduleLink);
      htmlBody += row("행사장소", "<span style=" + "\"" + rowStyle + "\"" + ">포시즌스 호텔 서울 ARA I+II (6층)</span><br>" + placeLink);
      htmlBody += "</table>";
      htmlBody += "<table style=" + "\"width:100%;border-collapse:collapse;margin:0 0 24px;font-size:14px;\"" + ">";
      htmlBody += row("담당자", "Woongjin Thinkbig");
      htmlBody += row("전화문의", "02-2075-1091");
      htmlBody += row("이메일주소", "yrna@wjthinkbig.com");
      htmlBody += "</table>";
      htmlBody += "<table style=" + "\"width:100%;border-collapse:collapse;margin:0 0 24px;font-size:14px;\"" + ">";
      htmlBody += row("참석자명", p.name || "");
      htmlBody += row("소속", p.affiliation || "");
      htmlBody += row("직책/직급", p.position || "");
      htmlBody += "</table>";
      htmlBody += "<p style=" + "\"font-size:12px;color:#999;\"" + ">문의사항은 <a style=" + "\"color:#4a6cf7;text-decoration:none;\"" + " href=" + "\"mailto:yrna@wjthinkbig.com\"" + ">yrna@wjthinkbig.com</a>으로 연락 부탁드립니다.</p>";
      htmlBody += "</div>";

      var plainBody =
        p.name + "님, 신청해주셔서 감사합니다.\n\n" +
        "행사일시: 2026년 9월 8일(화) 오전 7:30 ~ 10:00\n" +
        "행사장소: 포시즌스 호텔 서울 ARA I+II (6층) - " + mapLink + "\n" +
        "구글캘린더에 추가: " + calendarLink + "\n\n" +
        "문의: 02-2075-1091 / yrna@wjthinkbig.com";

      MailApp.sendEmail({
        to: p.email,
        replyTo: "yrna@wjthinkbig.com",
        name: "Woongjin Thinkbig",
        subject: subject,
        body: plainBody,
        htmlBody: htmlBody
      });
      Logger.log("MAIL_OK: sent to " + p.email);
    } catch (err) {
      Logger.log("MAIL_ERROR: " + err);
    }
  }

  return ContentService.createTextOutput(JSON.stringify({ result: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}
