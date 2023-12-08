export function formatDate (dateString: string){
    const date = new Date(dateString); // 创建一个 Date 对象
    const year = date.getFullYear(); // 获取年份
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 获取月份并补零
    const day = String(date.getDate()).padStart(2, '0'); // 获取日期并补零
    const hour = String(date.getHours()).padStart(2, '0'); // 获取小时并补零
    const minute = String(date.getMinutes()).padStart(2, '0'); // 获取分钟并补零
    const second = String(date.getSeconds()).padStart(2, '0'); // 获取秒钟并补零
    const formattedDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`; // 拼接格式化后的字符串
    return formattedDate;
}