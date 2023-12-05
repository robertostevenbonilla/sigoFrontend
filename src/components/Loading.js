import { CircularProgress } from "@mui/material"

export const Loading = ({ inModal = false }) => {
  return (
    <div className={!inModal ? 'area-loading' : 'area-loading-modal'}>
      <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap'}}>
        <CircularProgress style={{ color: '#00609C'}} />
      </div>
    </div>
  )
}
