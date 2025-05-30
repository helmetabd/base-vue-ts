import logoAvatar from '@/assets/images/logo-avatar.webp'

export function getAvatar(avatar: string | null | undefined) {
  if (avatar == undefined || avatar == null || avatar == 'null' || avatar == 'default') {
    return logoAvatar
  }
  const asset_url = import.meta.env.VITE_APP_ASSET_URL
  if (asset_url[0] != '/') {
    return `${asset_url}/${avatar}`
  } else {
    return asset_url + avatar
  }
}

export function getAsset(path: string | string[] | null) {
  const asset_url = import.meta.env.VITE_APP_ASSET_URL
  if (path != null) {
    if (asset_url[0] != '/') {
      return `${asset_url}/${path}`
    } else {
      return asset_url + path
    }
  } else {
    return '#'
  }
}

export function getCsv(path: string | null, file_name: string) {
  if (path != null) {
    const base_url = import.meta.env.VITE_APP_ASSET_URL
    return base_url + '/download-csv' + '?path=' + path + '&file_name=' + file_name
  } else {
    return '#'
  }
}
