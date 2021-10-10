import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {
  Button,
  ButtonGroup,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from '@mui/material';
import Moralis from 'moralis';
import React, { useCallback, useState } from 'react';
import { daixTokenAddress } from 'utils/constants';

interface Props {
  streamerAddress: string;
}

enum TipState {
  NONE,
  SUCCESS,
  ERROR,
}
const options = ['2', '5', '10'];

export const TipButton: React.FunctionComponent<Props> = ({ streamerAddress }) => {
  const [tipValue, setTipValue] = useState(5);
  const [tipState, setTipState] = useState<TipState>(TipState.NONE);
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index);
    setTipValue(Number.parseInt(options[index]));
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpen(false);
  };

  const resetTipState = useCallback(() => {
    setTipState(TipState.NONE);
  }, []);

  const sendTip = () => {
    Moralis.Web3.transfer({
      type: 'erc20',
      amount: Moralis.Units.Token(tipValue, 18),
      receiver: streamerAddress,
      contractAddress: daixTokenAddress,
    })
      .then(() => setTipState(TipState.SUCCESS))
      .catch(() => setTipState(TipState.ERROR));
  };
  return (
    <React.Fragment>
      <ButtonGroup variant="contained" ref={anchorRef}>
        <Button size="small" onClick={sendTip}>{`Tip ${options[selectedIndex]} DAI`}</Button>
        <Button size="small" onClick={handleToggle}>
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu">
                  {options.map((option, index) => (
                    <MenuItem
                      key={option}
                      selected={index === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>

    // <>
    //   <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Tip amount" onChange={tipValueChanger} />
    //   <IconButton onClick={sendTip} disabled={tipValue <= 0}>
    //     <DaiIcon />
    //   </IconButton>
    //   <Snackbar
    //     open={tipState === TipState.SUCCESS}
    //     autoHideDuration={6000}
    //     onClose={resetTipState}
    //   >
    //     <Alert onClose={resetTipState} severity="success" sx={{ width: '100%' }}>
    //       {`Successly sent a tip of ${tipValue} to ${streamerAddress}`}
    //     </Alert>
    //   </Snackbar>
    //   <Snackbar open={tipState === TipState.ERROR} autoHideDuration={6000} onClose={resetTipState}>
    //     <Alert onClose={resetTipState} severity="error" sx={{ width: '100%' }}>
    //       {`Error sending tip to ${streamerAddress} :(`}
    //     </Alert>
    //   </Snackbar>
    // </>
  );
};
