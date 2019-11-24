
# Gario Beta | Overview

## Architecture of heritage

- Entity *(can insert other entities inner)*
    - Character *(physic entity)*
        - Player *(controlable entity)*
        - Enemy *(patternable entity)*
            - Chip
            - Spider
            - Zombie
    - Collectable *(action if touch player)*
        - Checkpoint *(save state if old state is lower)*
        - Acumulable *(add to cumul and display self OFF)*
            - Money *(for trades)*
            - Life *(extra lifes)*
        - Triggerable *(multi action if touch player)*
            - Switch *(switch if touch player)*
            - Button *(unique action not reversible if touch player)*
            - Switton *(action while touch player)*
    - Environment *(important for physic)*
        - Lava
        - Platform
        - Ladder
        - Wall
- ParallaxeDecor *(decor of level)*

