export let status = '初始值'

export const change = (d) => {
  console.log(1, status)
  status = d
  // console.log(status)
}


export let getstatus = () => {
  // console.log(2, status)
  return status
}
