import 'izitoast/dist/css/iziToast.min.css'
import iZtoast from 'izitoast'

const toast = {
  error: (message, title = 'Erreur') => {
    return iZtoast.error({
      title: title,
      message: message,
      position: 'bottomCenter'
    })
  },
  success: (message, title = 'Succès') => {
    return iZtoast.success({
      title: title,
      message: message,
      position: 'bottomCenter'
    })
  }
}

export default toast
