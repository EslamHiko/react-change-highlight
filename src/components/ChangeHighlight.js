import React, { useState, useEffect } from 'react';
import { highlightClassName } from './styles';
import './styles';

export default ({
  children,
  showAfter = 500,
  hideAfter = 2500,
  containerClassName = '',
  highlightStyle = highlightClassName,
  disabled = false
}) => {
  const [myChildren, setMyChildren] = useState();
  let changedElementsList = new Set();

  const showHighlight = (element, showAfter = 500, hideAfter = 2500) => {
    setTimeout(() => {
      if (!element.ref.current.className.includes(highlightStyle)) {
        element.ref.current.className += ' ' + highlightStyle;
        let classNames = element.ref.current.className;

        setTimeout(() => {
          element.ref.current.className += ' fadeBg';
        }, hideAfter - 500);

        setTimeout(() => {
          element.ref.current.className = classNames
            .substr(0, classNames.indexOf(highlightStyle))
            .trim();
        }, hideAfter);
      }
    }, showAfter);
  };

  useEffect(() => {
    if (disabled) return;

    let firstTime = true;
    if (children) {
      if (!myChildren && firstTime) {
        setMyChildren(children);
        firstTime = false;
      } else {
        React.Children.map(children, newChild => {
          React.Children.map(myChildren, oldChild => {
            if (newChild.type === oldChild.type) {
              if (newChild.props.children !== oldChild.props.children) {
                setMyChildren(children);
                if (newChild.ref) {
                  changedElementsList.add(newChild);
                  showHighlight(newChild, showAfter, hideAfter);
                  return;
                }
              }
            }
          });
          return newChild.props.children;
        });
      }
    }
    return () => {};
  });

  return <div className={containerClassName}>{children}</div>;
};
