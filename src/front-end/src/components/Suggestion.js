import React from 'react';

import {Description, InnerWrapper, Image, Title, Wrapper} from './Suggestion.styles';

// import defaultPageThumbnail from '../images/defaultPageThumbnail.png';

const Suggestion = ({title, description, thumbnailUrl}) => {
  const descriptionContent = description ? <Description>{description}</Description> : null;

  return (
    <Wrapper>
      <Image src={thumbnailUrl} />
      <InnerWrapper>
        <Title>{title}</Title>
        {descriptionContent}
      </InnerWrapper>
    </Wrapper>
  );
};

export default Suggestion;