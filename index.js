const express = require("express");
const app = express();
const cors = require("cors");
const port = 5000;

app.use(express.json());
app.use(cors());

var month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function count_leap_year(start, end) {
  let c = 0;
  for (let i = start; i <= end; i++) {
    let leapDate = new Date(i, 1, 29);
    if (leapDate.getMonth() === 1 && leapDate.getDate() === 29) {
      // console.log(i);
      c++;
    }
  }
  return c;
}

function calculate_total_days(d, m, y) {
  let t = 0;
  t = t + (y * 365);
  for (let i = 0; i < m; i++){
    t = t + month[i];
  }
  t = t + d;
  return t;
}

function calculate_total_months(d, m, y) {
  let n = y * 12
  n = n + m;
  return [n, d];
}

function calculate_total_weeks(td) {
  let w = parseInt(td / 7);
  let d = Math.abs((w * 7) - td);
  return [w, d];
}

function calculate_total_hours(d) {
  return d * 24;
}

function calculate_total_min(h) {
  return h * 60;
}

function calculate_total_sec(m) {
  return m * 60;
}

app.post('/calculate-age', async(req, res) => {
    const body = req.body;
    // console.log(body);
    
    let birth_day = body.start_date;
    let birth_month = body.start_month;
    let birth_year = body.start_year;
    // console.log(birth_day, birth_month, birth_year);

    let leap_year_start = 0;
    let leap_year_end = 0;

    // let current_date = new Date();
    let current_day = body.end_date;
    let current_month = body.end_month;
    let current_year = body.end_year;
    // console.log(current_day, current_month, current_year);
  
    if (birth_month <= 1) {
      leap_year_start = birth_year;
    } else {
      leap_year_start = birth_year + 1;
    }

    if (current_month > 1) {
      leap_year_end = current_year;
    } else {
      leap_year_end = current_year-1;
    }

    if (birth_day == 29 && birth_month == 1) {
      leap_year_end++;
    }

    if (birth_day > current_day) {
      current_day = current_day + month[birth_month - 1];
      current_month = current_month - 1;
    }

    if (birth_month > current_month) {
      current_month = current_month + 12;
      current_year = current_year - 1;
    }

    var calculated_date = current_day - birth_day;
    var calculated_month = current_month - birth_month;
    var calculated_year = current_year - birth_year;
    
    // console.log(birth_month);

    const cnt = count_leap_year(leap_year_start, leap_year_end);

    if (cnt % 30 == 0) {
      calculated_month = calculated_month + cnt / 30;
    }

    calculated_date = calculated_date + cnt;
    if (calculated_date >= 30) {
        calculated_date = calculated_date - 30;
        calculated_month = calculated_month + 1;
    }
  
    let total_days = calculate_total_days(calculated_date,calculated_month,calculated_year);
    
    let total_weeks = calculate_total_weeks(total_days);
    
    let total_months = calculate_total_months(
      calculated_date,
      calculated_month,
      calculated_year
    );
  
    let total_hours = calculate_total_hours(total_days);
    
    let total_mins = calculate_total_min(total_hours);
    
    let total_sec = calculate_total_sec(total_mins);

    res.json({
      date: calculated_date,
      month: calculated_month,
      year: calculated_year,
      total_days: `${total_days} Days`,
      total_month: `${total_months[0]} Months ${total_months[1]} Days`,
      total_weeks: `${total_weeks[0]} Weeks ${total_weeks[1]} Days`,
      total_hours: `${total_hours} Hours`,
      total_min: `${total_mins} Minutes`,
      total_sec: `${total_sec} Seconds`
    });
})

app.get("/", (req, res) => {
  res.send("Running");
});

app.listen(port, () => {
  console.log(`App is running or Port ${port}`);
});
