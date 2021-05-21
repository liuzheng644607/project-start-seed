import React from 'react';

interface RoomContext {
  socket?: SocketIOClient.Socket;
}

export interface ContextProps {
  playerService: RoomContext;
}

export const RoomContext = React.createContext<RoomContext | null>(null);

export function wrapContext<P extends ContextProps>(Klass: React.ComponentType<P>) {
  // eslint-disable-next-line
  return React.forwardRef((props: Omit<P, 'playerService'>, ref) => (
    <RoomContext.Consumer>
      {(playerService) => {
        if (playerService) {
          // eslint-disable-next-line
          const newProps = Object.assign({}, props, { playerService }) as any;
          console.log(newProps);
          return <Klass {...newProps} ref={ref} />;
        } else {
          return null;
        }
      }}
    </RoomContext.Consumer>
  ));
}
