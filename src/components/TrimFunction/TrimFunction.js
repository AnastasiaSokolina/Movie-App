const trimFunction = (text, length, ending = '...') => {
    if (text.length <= length) return text
    const trimmedString = text.slice(0, length + 1)
    return trimmedString.slice(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(' '))) + ending
  }
  export default trimFunction