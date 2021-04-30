function getFormatDate(date){
	const dates = new Date(date);
	var year = dates.getFullYear();
	var month = dates.getMonth()+1;
	month = month < 10 ? "0"+month:month;
	var day = dates.getDate();
	day = day <10 ? "0"+day:day;
	const regdate = `${year}-${month}-${day}`;
	return regdate.substring(2,regdate.length);
	console.log(year);
}