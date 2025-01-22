'use client';

import Container from '../ui/container';

const Navbar = () => {
  return (
    <div className='border-b'>
      <Container defaultPY className='flex items-center'>
        <h1 className='font-extrabold'>Jupiter Todo</h1>
      </Container>
    </div>
  );
};

export default Navbar;
