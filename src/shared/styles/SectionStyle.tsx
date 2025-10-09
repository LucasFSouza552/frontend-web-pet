import styled from "styled-components";

const Section = styled.section<{ height?: string | undefined }>`
  width: 100%;
  height: ${({ height }) => height || "100dvh"};
  display: flex;
  flex-direction: column;
`;

export default Section;