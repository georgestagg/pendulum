var fixedPoint = [0,30.0,0];
var g = 3.0
var mass1,mass2;
var length1,length2;
var phi1,phi2,vphi1,vphi2;
var dt = 0.00002;
var theta1,vtheta1,theta2,vtheta2;
function initSinglePendulum() {
	mass1 = 1.0;
	length1 = 10.0;
	theta1 = 1.0;
	phi1 = 0.0;
	vtheta1 = 0.0;
	vphi1 = 0.0;
}

function initDoublePendulum() {
	mass1 = 1.0;
	mass2 = 2.0
	length2 = 10.0
	length1 = 10.0;
	theta1 = 1.0;
	theta2 = 2.0;
	phi1 = 0.5;
	phi1 = 1.0;
	vtheta1 = 2.0;
	vtheta2 = 1.0
	vphi1 = 0.0;
	vphi2 = 0.0;
}

function updateSinglePendulum() {
	F = rhsSinglePendulum();
	theta1 = theta1 + vtheta1*dt;
	phi1 = phi1 + vphi1*dt;
	vtheta1 = vtheta1 + F[0]*dt;
	vphi1 = vphi1 + F[1]*dt;
}

function updateDoublePendulum() {
	F = rhsDoublePendulum();
	theta1 = theta1 + vtheta1*dt;
	theta2 = theta2 + vtheta2*dt;
	phi1 = phi1 + vphi1*dt;
	phi2 = phi2 + vphi2*dt;
	vtheta1 = vtheta1 + F[0]*dt;
	vtheta2 = vtheta2 + F[1]*dt;
	vphi1 = vphi1 + F[1]*dt;
	vphi2 = vphi2 + F[2]*dt;
}

function getSinglePendulumP1() {
	return [length1*Math.sin(theta1)*Math.cos(phi1),length1*Math.sin(theta1)*Math.sin(phi1),-length1*Math.cos(theta1)];
}
function getDoublePendulumP1() {
	return [length1*Math.sin(theta1)*Math.cos(phi1),length1*Math.sin(theta1)*Math.sin(phi1),-length1*Math.cos(theta1)];
}
function getDoublePendulumP2() {
	P1 = getDoublePendulumP2()
	return [P1[0] + length2*Math.sin(theta2)*Math.cos(phi2),P1[1] + length2*Math.sin(theta2)*Math.sin(phi2),P[2]-length2*Math.cos(theta2)];
}
function getSinglePendulumV() {
	v = [0,0];
	v[0] = length1*vtheta1;
	v[1] = length1*vphi1*Math.sin(theta1);
	return Math.sqrt(v[0]*v[0] + v[1]*v[1]);
}
function getDoublePendulumV1() {
	v = [0,0];
	v[0] = length1*vtheta1;
	v[1] = length1*vphi1*Math.sin(theta1);
	return Math.sqrt(v[0]*v[0] + v[1]*v[1]);
}
function getDoublePendulumV2() {
	v = getDoublePendulumV1();
	v[0] += length2*vtheta2;
	v[1] += length2*vphi2*Math.sin(theta2);
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
function getDoubelPendulumE() {
	P1 = getDoublePendulumP1();
	P1 = getDoublePendulumP2();
	v = [0,0,0,0];
	v[0] = length1*vtheta1;
	v[1] = length1*vphi1*Math.sin(theta1);
	v[2] = v[0] + length2*vtheta2;
	v[3] = v[1] + length2*vphi2*Math.sin(theta2);

	K = 0.5*mass1* (v[0]*v[0] + v[1]*v[1]) + 0.5*mass2* (v[2]*v[2] + v[3]*v[3]);
	P = mass1*g*(P1[2]+10) + mass2*g*(P2[2]+P1[2]+20);
	return K+P;
}
function rhsSinglePendulum() {
	ddtheta1 = vphi1*vphi1*Math.sin(theta1)*Math.cos(theta1) - (g/length1)*Math.sin(theta1);
	if(theta1 == 0){
		ddphi1 = 0
	} else {
		ddphi1 = -2*vphi1*vtheta1*Math.cos(theta1)/Math.sin(theta1);
	}
	return [ddtheta1,ddphi1];
}

function rhsDoublePendulum() {
	ddtheta1 = vphi1*vphi1*Math.sin(theta1)*Math.cos(theta1) - (g/length1)*Math.sin(theta1);
	ddphi1 = -2*vphi1*vtheta1*Math.cos(theta1)/Math.sin(theta1);
	return [ddtheta1,ddphi1];
}