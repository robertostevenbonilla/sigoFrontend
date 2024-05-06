import { CircularProgress } from "@mui/material"

export const Loading = ({ inModal = false }) => {
  return (
    <div className={!inModal ? 'area-loading' : 'area-loading-modal'}>
      <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap'}}>
        <CircularProgress size={200} style={{ color: '#3364ff', margin: "auto"}} />
      </div>
    </div>
  )
}
