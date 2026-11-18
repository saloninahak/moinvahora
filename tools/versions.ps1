$p = 'next','react','react-dom','gsap','@gsap/react','lenis','three','@types/three','@lottiefiles/dotlottie-react','@rive-app/react-canvas','tailwindcss','@tailwindcss/postcss','typescript','eslint','eslint-config-next','@types/react','@types/node','@types/react-dom'
foreach ($x in $p) { Write-Output ("$x " + (npm.cmd view $x version 2>$null)) }
Write-Output "DONE"
