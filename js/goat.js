function maxSpeedEnforcement(speed, maxSpeed) {
    if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }
}

function Goat(game) {

    // Game physics:
    this.ground = 480; // changed value from 400
    this.x = 0;
    this.y = this.ground;
    this.width = 96;
    this.height = 95;
    this.lastY = this.y; // TODO: to be used for animation drawing calculations when jumping btwn platforms
    this.velocity = {x: 0, y: 0};
    this.speed = 5;
    this.jumpHeight = 200;

    // Platforms
    this.lastPlatform = game.platforms[0]; // Ground platform
    this.currentPlatform = this.lastPlatform;

    // Animations:
    this.standLeftAnimation = new Animation(ASSET_MANAGER.getAsset("./img/WhiteGoatLeft.png"), 0, 0, 96, 95, 0.1, 4, true, true);
    this.standRightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/WhiteGoatRight.png"), 768, 0, 96, 95, 0.1, 4, true, false);
    //this.idleAnimation              = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);
    //
    this.jumpLeftAscendAnimation = new Animation(ASSET_MANAGER.getAsset("./img/WhiteGoatLeft.png"), 0, 0, 96, 95, 0.1, 4, false, true);
    this.jumpRightAscendAnimation = new Animation(ASSET_MANAGER.getAsset("./img/WhiteGoatRight.png"), 768, 0, 96, 95, 0.1, 4, false, false);
    //this.jumpLeftDescendAnimation   = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);
    //this.jumpRightDescendAnimation    = new Animation(ASSET_MANAGER.getAsset("./img/WhiteGoatRight.png"), 768, 0, 96, 96, 0.1, 4, false, false);
    //this.landLeftAnimation          = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);
    //this.landRightAnimation         = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);
    //
    this.runLeftAnimation = new Animation(ASSET_MANAGER.getAsset("./img/WhiteGoatLeft.png"), 384, 0, 96, 95, 0.1, 4, true, true);
    this.runRightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/WhiteGoatRight.png"), 385, 0, 96, 95, 0.1, 4, true, false);
    //
    //this.chargingLeftAnimation      = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);
    //this.chargingRightAnimation     = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);
    //this.attackLeftAnimation        = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);
    //this.attackRightAnimation       = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);
    //this.stunnedLeftAnimation       = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);
    //this.stunnedRightAnimation      = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);

    // Action states
    this.right = true; // Facing right (true) or left (false)
    this.standing = true;
    this.idle = false;
    this.jumping = false;
    this.falling = false;
    this.running = false;
    this.charging = false;
    this.attacking = false;
    this.stunned = false;

    //this.boundingBox = new BoundingBox(this.x + 25, this.y, this.standAnimation.frameWidth - 40, this.standAnimation.frameHeight - 20);

    // Game engine stuff:
    //this.game = game;
    //this.ctx = game.ctx;

    Entity.call(this, game, 0, this.y, this.width, this.height);
}

Goat.prototype = new Entity();
Goat.prototype.constructor = Goat;

Goat.prototype.reset = function () {
    this.right = true;
    this.standing = true;
    this.idle = false;
    this.jumping = false;
    this.falling = false;
    this.running = false;
    this.charging = false;
    this.attacking = false;
    this.stunned = false;

    this.x = 0;
    this.y = 0;

    //this.boundingbox = new BoundingBox(this.x, this.y, this.standAnimation.frameWidth, this.standAnimation.frameHeight);
};

Goat.prototype.update = function () {


    // Update goat's facing direction (LEFT or RIGHT)
    if (this.game.right) {
        this.right = true;
    } else if (this.game.left) {
        this.right = false;
    }

    // The goat begins a JUMP:
    if (this.game.space && !this.jumping && !this.falling) {
        this.jumping = true;
        this.lastPlatform = this.currentPlatform;
        //this.currentPlatform = null; // TODO: Buggy if you set it to null
        console.log("Jumped");
        this.base = this.y + this.height; // Keep track of the goat's last bottom-y value
    }

    // WHILE the goat is JUMPING:
    if (this.jumping) {

        // Figure out which jump animation (left or right) to use
        var jumpAscendAnimation = this.right ? this.jumpRightAscendAnimation : this.jumpLeftAscendAnimation;

        // Jumping is finished:
        if (jumpAscendAnimation.isDone()) {

            // Reset jump animation timer
            jumpAscendAnimation.elapsedTime = 0;

            // Reset 'jump' state.
            this.jumping = false;
            this.falling = false;
        }
        var jumpDistance = jumpAscendAnimation.elapsedTime / jumpAscendAnimation.totalTime;

        var totalHeight = 300;

        if (jumpDistance > 0.5){
            this.falling = true;
            jumpDistance = 1 - jumpDistance;
        }

        //var height = jumpDistance * 2 * totalHeight;
        var height = totalHeight * (-2 * (jumpDistance * jumpDistance - jumpDistance));

        this.lastY = this.y;
        this.y = this.base - height;
    }

    // Update running state:
    this.game.right || this.game.left ? this.running = true : this.running = false;


    // Running and boundary collisions:
    if (this.running) {
        if (this.game.right && this.x < this.game.surfaceWidth - this.width) this.x += this.speed;
        if (this.game.left && this.x > 0) this.x -= this.speed;
        //TODO: Fix floating when running off of platforms
    }

    // Collisions with platforms:
    var platforms = this.game.platforms;

    for (var i = 0; i < platforms.length; i++) {
        if (platforms[i] !== this) { // Prevents collision with self! ~Duy
            if (this.boundingBox.collide(platforms[i].boundingBox)) {

                // Debug:
                console.log("COLLISION WITH " + platforms[i]);

                // If falling?


                this.currentPlatform = platforms[i];
                this.y = this.currentPlatform.y - this.height - 1; // Add an extra pixel to separate goat from platform
            } else {
                this.collide = false;
                platforms[i].collided = false;
            }
        }

    }

    Entity.prototype.update.call(this);
};

Goat.prototype.draw = function (ctx) {

    if (this.jumping) {
        if (this.right)
            this.jumpRightAscendAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
        else
            this.jumpLeftAscendAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    } else if (this.running) {
        if (this.right)
            this.runRightAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
        else
            this.runLeftAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);

    } else {
        if (this.right)
            this.standRightAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
        else
            this.standLeftAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }

    Entity.prototype.draw.call(this, ctx);
};

Goat.prototype.toString = function () {
    return 'Goat';
};
