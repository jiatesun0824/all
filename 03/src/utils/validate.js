export function validatePhone(val) {
   const res=/^1[3-578]\d{9}$/;
   return res.test(val)
}
