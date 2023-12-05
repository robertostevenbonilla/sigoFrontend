import { Collapse, Paper } from '@mui/material';
import { useEffect, useState } from 'react';
import { QuestionMark } from '@mui/icons-material';
/* import { useModal } from '../hooks/useModal'; */

import PropTypes from 'prop-types';

import '../styles/card.css';

export const Card = ({
  title,
  icon,
  children,
  openCollapse = false,
  block = false,
  loadEvent = () => {},
  idElement = '',
  activeHelp = false,
}) => {

  const [isOpen, setIsOpen] = useState(openCollapse);
  const [isInitEvent, setIsInitEvent] = useState(false);
  /* const { openHelpDialog } = useModal(); */
  // const [elevation, setElevation] = useState(3);

  const onClickCollpased = () => {
    setIsOpen(!isOpen);
    clickLoadEventInit();
    setIsInitEvent(true);
  };

  const clickLoadEventInit = async () => {
    if ( !isInitEvent ) {
      loadEvent && await loadEvent();
    }
  }

  const openDialog = () => { 
    /* openHelpDialog({ title, text: ''}); */
  }

  useEffect(() => {
    setIsOpen(openCollapse);
  }, [openCollapse]);

  return (
    <Paper
      elevation={3}
      style={{
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        width: '98%',
        margin: '5px auto',
        marginBottom: '20px'
      }}
      id={idElement}
    >
      <div className="card__card-title-container">
        {icon && <div className="card__icon" onClick={onClickCollpased}>{icon}</div>}
        <div className="card__card-container-description">
          <div style={{ textOverflow: 'ellipsis', overflow: 'hidden' }} onClick={onClickCollpased}>
            <p className="card__title" style={icon ? {} : { marginLeft: '20px' }}>
              {title}
            </p>
          </div>
          {activeHelp && (
            <div className="card__icon-help-container" /* onClick={openDialog} */>
              <QuestionMark sx={{ fontSize: '22px' }}/>
            </div>
          )}
        </div>
      </div>
      <Collapse in={block ? false : isOpen}>
        <div className="card__body-container" style={{ marginBottom: '25px' }}>
          {children}
        </div>
      </Collapse>
    </Paper>
  );
};

Card.propTypes = {
  children: PropTypes.node,
  title   : PropTypes.string.isRequired,
  icon    : PropTypes.element
}
