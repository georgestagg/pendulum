#include<stdio.h>


template< typename T >
T operator^( T x, T y ) {
    return std::pow( x, y );
}


int main() {
	T<float> x = 2.0;
	T<float> y = 3.0;

  printf("%f\n",x^y);
  return 0;
}