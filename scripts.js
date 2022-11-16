const BASE_ENDPOINT = 'https://cssstats.com/api/stats?url='
const websiteInputField = document.querySelector('.website-input-field')
const cookieElement = document.querySelector('.cookie')
const cookieOuter = document.querySelector('.cookie-outer')
const cookieInner = document.querySelector('.cookie-inner')
const cookieButtons = document.querySelectorAll('.cookie-button')
const loadingSpiner = document.querySelector('.loading-spinner')

const fetchStyles = async (url) => {
  loadingSpiner.classList.remove('hide')
  cookieElement.classList.add('hide')

  try {
    const response = await fetch(BASE_ENDPOINT + url)
    if (!response.ok) {
      console.log(response)
      throw new Error(response.statusText)
    }
    const data = await response.json()
    loadingSpiner.classList.add('hide')
    return data
  } catch (e) {
    loadingSpiner.classList.add('hide')
    console.log(e)
  }
}

const onChange = async (e) => {
  const fetchUrl = e.target.value
  const data = await fetchStyles(fetchUrl)
  renderStyles(data)
}

const renderStyles = (data) => {
  const propertiesObject = data.stats.declarations.properties

  const {
    'background-color': backgroundColors,
    ['color']: textColors,
    'font-family': fontFamilies,
    'border-color': borderColors,
  } = propertiesObject

  const mostFrequentBackgroundColor = mostFrequent(backgroundColors)
  const mostFrequentTextColor = mostFrequent(textColors)
  const mostFrequentBorderColor = mostFrequent(borderColors)
  const mostFrequentFontFamily = firstStringBeforeComma(
    mostFrequent(fontFamilies)
  )

  console.log(
    mostFrequentBackgroundColor,
    mostFrequentTextColor,
    mostFrequentBorderColor,
    mostFrequentFontFamily
  )

  cookieOuter.style.backgroundColor = mostFrequentBackgroundColor
  cookieOuter.style.color = mostFrequentTextColor
  cookieButtons.forEach(
    (cookieButton) => (cookieButton.style.borderColor = mostFrequentBorderColor)
  )

  cookieElement.classList.remove('hide')
}

websiteInputField.addEventListener('change', onChange)

// utils
function mostFrequent(arr) {
  if (!arr) {
    return ''
  }
  return arr
    .sort(
      (a, b) =>
        arr.filter((v) => v === a).length - arr.filter((v) => v === b).length
    )
    .pop()
}

function firstStringBeforeComma(string) {
  const indexOfFirstComma = string.indexOf(',')
  return string.slice(0, indexOfFirstComma)
}
