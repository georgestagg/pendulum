var fixedPoint = [0,30.0,0];
var g = 3.0
var mass1,mass2,mass3;
var length1,length2,length3;
var phi1,vphi1;
var dt = 0.00002;
var theta1,vtheta1;
function initSinglePendulum() {
	mass1 = 1.0;
	length1 = 10.0;
	theta1 = 0.0;
	phi1 = 0.5;
	vtheta1 = 2.0;
	vphi1 = 0.0;
}

function rhsSinglePendulum() {
	dtheta1 = vtheta1;
	dphi1 = vphi1;
	ddtheta1 = dphi1*dphi1*Math.sin(theta1)*Math.cos(theta1) - (g/length1)*Math.sin(theta1);
	if(theta1 == 0){
		ddphi1 = 0
	} else {
		ddphi1 = -2*dphi1*dtheta1*Math.cos(theta1)/Math.sin(theta1);
	}
	return [ddtheta1,ddphi1];
}
function updateSinglePendulum() {
	F = rhsSinglePendulum();
	theta1 = theta1 + vtheta1*dt;
	phi1 = phi1 + vphi1*dt;
	vtheta1 = vtheta1 + F[0]*dt;
	vphi1 = vphi1 + F[1]*dt;
}

function getSinglePendulumP1() {
	return [length1*Math.sin(theta1)*Math.cos(phi1),length1*Math.sin(theta1)*Math.sin(phi1),-length1*Math.cos(theta1)];
}
function getSinglePendulumV() {
	P1 = getSinglePendulumP1();
	v = [0,0];
	v[0] = length1*vtheta1;
	v[1] = length1*vphi1*Math.sin(theta1);
	return Math.sqrt(v[0]*v[0] + v[1]*v[1]);
}
function getSinglePendulumE() {
	P1 = getSinglePendulumP1();
	v = [0,0];
	v[0] = length1*vtheta1;
	v[1] = length1*vphi1*Math.sin(theta1);

	K = 0.5*mass1* (v[0]*v[0] + v[1]*v[1]);
	P = mass1*g*(P1[2]+10);
	return K+P;
}