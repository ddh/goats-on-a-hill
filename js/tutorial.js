// Sub-class of Scene
// Tutorial: Background (& text/images drawn on Canvas)

function Tutorial(gameEngine) {
    this.game = gameEngine;
    this.type = "Tutorial";
    
    this.next = null;
    this.running = false;
    this.isDone = false;
    
    this.background = new Background(this.game, ASSET_MANAGER.getAsset("./img/mountainforest.png"), 800, 600)
    
    this.backButtonHitbox = {left: 20, right: 110, top: 490, bottom: 580};
    
    this.backButtonHover = false;
    
    // Hill animation
    this.hill = new Platform(gameEngine, 'm', 625, 100, 'stationary', 'hay');
    this.hill.isHill = true;

    this.timeExpire = 15; // For floaty powerups
    
    this.charge = 0; // for charge meter
    
    // Powerup animations
    this.speedUpAnimation = new Animation(ASSET_MANAGER.getAsset("./img/collectible-speedUp.png"), 0, 0, 40, 40, 0.1, 1, true, false);
    this.invincibilityAnimation = new Animation(ASSET_MANAGER.getAsset("./img/collectible-invincibility.png"), 0, 0, 40, 40, 0.1, 1, true, false);
    this.attackUpAnimation = new Animation(ASSET_MANAGER.getAsset("./img/collectible-attackUp.png"), 0, 0, 40, 40, 0.1, 1, true, false);
    this.doubleJumpAnimation = new Animation(ASSET_MANAGER.getAsset("./img/collectible-doubleJump.png"), 0, 0, 40, 40, 0.1, 1, true, false);
    this.highJumpAnimation = new Animation(ASSET_MANAGER.getAsset("./img/collectible-highJump.png"), 0, 0, 40, 40, 0.1, 1, true, false);
    this.maxChargeAnimation = new Animation(ASSET_MANAGER.getAsset("./img/collectible-maxCharge.png"), 0, 0, 40, 40, 0.1, 1, true, false);

    // Blue goat animations
    this.runRightAnimationBlue = new Animation(ASSET_MANAGER.getAsset("./img/blue-goat-right.png"), 376, 0, 94, 90, 0.075, 4, true, false);
    this.jumpRightAnimationBlue = new Animation(ASSET_MANAGER.getAsset("./img/blue-goat-right.png"), 846, 0, 94, 90, 0.1, 8, true, false);
    this.attackRightAnimationBlue = new Animation(ASSET_MANAGER.getAsset("./img/blue-goat-right.png"), 1974, 0, 94, 90, 0.1, 1, true, false);
    this.attackAuraRightAnimationBlue = new Animation(ASSET_MANAGER.getAsset("./img/blue-goat-attackAuraRight.png"), 16, 0, 43, 150, .1, 4, true, true);
    
    // Green goat animations
    this.runRightAnimationGreen = new Animation(ASSET_MANAGER.getAsset("./img/green-goat-right.png"), 376, 0, 94, 90, 0.075, 4, true, false);
    this.jumpRightAnimationGreen = new Animation(ASSET_MANAGER.getAsset("./img/green-goat-right.png"), 846, 0, 94, 90, 0.1, 8, true, false);
    this.attackRightAnimationGreen = new Animation(ASSET_MANAGER.getAsset("./img/green-goat-right.png"), 1974, 0, 94, 90, 0.1, 1, true, false);
    this.attackAuraRightAnimationGreen = new Animation(ASSET_MANAGER.getAsset("./img/green-goat-attackAuraRight.png"), 16, 0, 43, 150, .1, 4, true, true);
}

Tutorial.prototype = new Scene();
Tutorial.prototype.constructor = Tutorial;

/***********************************************
 *  START OF SCENE 'INTERFACE' IMPLEMENTATION  *
 ***********************************************/

Tutorial.prototype.reset = function () {
    
};

Tutorial.prototype.update = function () {
    // Check for mouse/keyboard input
    // game.mouse for hover, game.click for click
    if (this.running) {
        this.timeExpire -= this.game.clockTick;
        if (this.timeExpire < 0) {
            this.timeExpire = 15;
        }
        this.charge += 1;
        if (this.charge > 70) {
            this.charge = 0;
        }
        
        this.backButtonHover = false;
        
        if (this.game.mouse) {
            if (this.game.mouse.x < this.backButtonHitbox.right && this.game.mouse.x > this.backButtonHitbox.left &&
                this.game.mouse.y < this.backButtonHitbox.bottom && this.game.mouse.y > this.backButtonHitbox.top) {
                
                this.backButtonHover = true;
            }
        }
        
        if (this.game.click) {
            if (this.game.click.x < this.backButtonHitbox.right && this.game.click.x > this.backButtonHitbox.left &&
                this.game.click.y < this.backButtonHitbox.bottom && this.game.click.y > this.backButtonHitbox.top) {
                
                this.isDone = true;;
            }
        }
    }
};

Tutorial.prototype.draw = function (ctx) {
    this.background.draw(ctx);
    
    // For a darker background
    drawRoundedRect(ctx, 0, 0, 800, 600, 0, "rgba(0, 0, 0, 0.3)", "rgb(0, 0, 0)");
    
    // Back button
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/back.png"), 20, 490, 90, 90);
   
    // Objective
    drawTextWithOutline(ctx, "26px Impact", "Objective:", 20, 40, 'indigo', 'white');
    drawTextWithOutline(ctx, "22px Impact", "Gain points by being the sole goat on the hill!", 170, 40, 'black', 'white');
    this.hill.draw(ctx);
    
    // Controls
    drawTextWithOutline(ctx, "26px Impact", "Controls:", 20, 100, 'indigo', 'white');
    drawTextWithOutline(ctx, "22px Impact", "Press Esc to pause the game", 170, 100, 'black', 'white');
    drawTextWithOutline(ctx, "22px Impact", "Hold jump key to jump higher", 170, 130, 'black', 'white');
    drawTextWithOutline(ctx, "22px Impact", "Hold attack key to charge up an attack", 170, 160, 'black', 'white');
    drawRoundedRect(ctx, 525, 147, 70, 10, 2, "rgba(255, 255, 0, .5)", "rgb(255, 0, 0)");       // Charge meter
    drawRoundedRect(ctx, 525, 147, this.charge, 10, 2, "rgb(0, 255, 0)", "rgb(255, 0, 0)");     // Charge meter
    
    // Blue goat animations and controls
    drawTextWithOutline(ctx, "22px Impact", "Player 1 (Blue goat)", 170, 190, 'blue', 'white');    
    this.runRightAnimationBlue.drawFrame(this.game.clockTick, ctx, 170, 200, 0.65);
    drawTextWithOutline(ctx, "22px Impact", "A   D", 180, 300, "blue", "white");
    drawTextWithOutline(ctx, "22px Impact", "Shift to run", 180, 340, "blue", "white");
    this.jumpRightAnimationBlue.drawFrame(this.game.clockTick, ctx, 250, 200, 0.65);
    drawTextWithOutline(ctx, "22px Impact", "W", 280, 300, "blue", "white");
    this.attackRightAnimationBlue.drawFrame(this.game.clockTick, ctx, 360, 200, 0.65);
    this.attackAuraRightAnimationBlue.drawFrame(this.game.clockTick, ctx, 360 - 50, 200 - 15, 0.65 * 5);
    drawTextWithOutline(ctx, "22px Impact", "F", 390, 300, "blue", "white");
    
    // Green goat animations and controls
    drawTextWithOutline(ctx, "22px Impact", "Player 2 (Green goat)", 500, 190, 'green', 'white');
    this.runRightAnimationGreen.drawFrame(this.game.clockTick, ctx, 500, 200, 0.65);
    drawTextWithOutline(ctx, "22px Impact", "◀,   ▶", 510, 300, "green", "white");
    drawTextWithOutline(ctx, "22px Impact", ".   to run", 510, 340, "green", "white");
    this.jumpRightAnimationGreen.drawFrame(this.game.clockTick, ctx, 580, 200, 0.65);
    drawTextWithOutline(ctx, "22px Impact", "▲", 610, 300, "green", "white");
    this.attackRightAnimationGreen.drawFrame(this.game.clockTick, ctx, 690, 200, 0.65);
    this.attackAuraRightAnimationGreen.drawFrame(this.game.clockTick, ctx, 690 - 50, 200 - 15, 0.65 * 5);
    drawTextWithOutline(ctx, "22px Impact", "/", 720, 300, "green", "white");
    
    
    // Powerups
    drawTextWithOutline(ctx, "26px Impact", "Powerups:", 20, 400, 'indigo', 'white');
    
    // Left 3 powerups
    this.speedUpAnimation.drawFrame(this.game.clockTick, ctx, 170, 370 + Math.sin(this.timeExpire * 5) * 5, 1);
    drawTextWithOutline(ctx, "22px Impact", "Double your speed", 230, 395, "black", "white");    
    this.invincibilityAnimation.drawFrame(this.game.clockTick, ctx, 170, 450 + Math.sin(this.timeExpire * 5) * 5, 1);
    drawTextWithOutline(ctx, "22px Impact", "Invincible to attacks", 230, 475, "black", "white");
    this.attackUpAnimation.drawFrame(this.game.clockTick, ctx, 170, 530 + Math.sin(this.timeExpire * 5) * 5, 1);
    drawTextWithOutline(ctx, "22px Impact", "Attack multiple goats", 230, 555, "black", "white");
    
    // Right 3 powerups
    this.doubleJumpAnimation.drawFrame(this.game.clockTick, ctx, 450, 370 + Math.sin(this.timeExpire * 5) * 5, 1);
    drawTextWithOutline(ctx, "22px Impact", "Jump one more time", 510, 395, "black", "white");
    this.highJumpAnimation.drawFrame(this.game.clockTick, ctx, 450, 450 + Math.sin(this.timeExpire * 5) * 5, 1);
    drawTextWithOutline(ctx, "22px Impact", "Jump higher", 510, 475, "black", "white");
    this.maxChargeAnimation.drawFrame(this.game.clockTick, ctx, 450, 530 + Math.sin(this.timeExpire * 5) * 5, 1);
    drawTextWithOutline(ctx, "22px Impact", "Charge meter is at full", 510, 555, "black", "white");
    
    // Back to Title button
    if (this.backButtonHover) {
        drawRoundedRect(ctx, this.backButtonHitbox.left, 
                             this.backButtonHitbox.top, 
                             this.backButtonHitbox.right - this.backButtonHitbox.left, 
                             this.backButtonHitbox.bottom - this.backButtonHitbox.top, 
                             50,
                             "rgba(255, 255, 255, 0.4)",
                             "rgba(255, 255, 255, 0)");
    }
};

// performs variable initialization
Tutorial.prototype.startScene = function () {
    this.running = true;
    this.isDone = false;
};

// performs cleanup operations
Tutorial.prototype.endScene = function () {
    this.isDone = true;
    this.running = false;
};

// checks if user has clicked to play or see tutorial
Tutorial.prototype.isSceneDone = function () {
    return this.isDone;
};

/***********************************************
 *   END OF SCENE 'INTERFACE' IMPLEMENTATION   *
 ***********************************************/