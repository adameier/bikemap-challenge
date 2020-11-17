import data from './data.json'

const pointsData = JSON.parse(data.polyline)[0]

const vertices = pointsData.reduce((prev, curr, i) => {
  return prev.concat(curr)
}, [])

function long2tile(lon, zoom) {
  return ((lon + 180) / 360) * Math.pow(2, zoom)
}

function lat2tile(lat, zoom) {
  return (
    ((1 -
      Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) /
      2) *
    Math.pow(2, zoom)
  )
}

function getRouteVertices(zoom) {
  return pointsData.reduce((prev, curr) => {
    const x = long2tile(curr[1], zoom)
    const y = lat2tile(curr[0], zoom)
    const z = curr[2]
    return prev.concat([x, y, z])
  }, [])
}

export { getRouteVertices, vertices }
