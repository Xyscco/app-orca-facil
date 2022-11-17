import { Row, Text } from 'native-base';

export function EmptyList(props) {

  return (
    <Row flexWrap="wrap" justifyContent="center">
      <Text color="white" fontSize="sm" textAlign="center">
        {props.msg}
      </Text>

    </Row>
  );
}