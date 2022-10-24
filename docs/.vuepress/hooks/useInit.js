export const useInit = () => {
  const wxNavWrapepr = document.querySelector('.wx-nav-wrapper')
  if (wxNavWrapepr) {
    return
  }

  const wxNavbarItem = document.querySelector('nav.navbar-items .navbar-item:nth-last-child(2)')
  if (!wxNavbarItem) {
    return
  }

  const wxDomDiv = document.createElement('div')
  wxDomDiv.classList.add('wx-nav-wrapper')
  const wxDomImg = document.createElement('img')
  wxDomImg.src = '/images/wx/qrcode_258_8.jpg'
  wxDomDiv.appendChild(wxDomImg)
  const wxDomText = document.createElement('div')
  wxDomText.innerText = '微信订阅号'
  wxDomDiv.appendChild(wxDomText)

  wxNavbarItem.appendChild(wxDomDiv)
}