# Changelog

*Changelog created using the [Simple Changelog](https://marketplace.visualstudio.com/items?itemName=tobiaswaelde.vscode-simple-changelog) extension for VS Code.*

## [0.0.9-dev] - 2024-03-06
### Added
- Main menu was rewrited on @napi-rs/canvas
- All rendering on canvas get performence boost with image links caching and emoji/image prerender
- Now text on canvas has own auto font size function, helps with localization.
- When using canvas prerender, it has timer (to see how fast and slow it is)

### Deprecated
- main_menu for Browser was deprecated and will deleted soon

### Fixed
- Now temp.json file for Caching module was correctly deleting after process is stopped


## [0.0.8-dev] - 2024-03-03
### Added
- We're experimenting with using @napi-rs/canvas library for rendering using canvas element instead of rendering entire html page using browser.
- Experiment with boat movement is success. Now the camera rotates as the boat.
- We're implementing the canvas.js file for project to make canvas pages development process more easier and more predictable.


## [0.0.7-dev] - 2024-03-03
### Added
- We're making experiments with boat movement. So we're created a other test command with own page (we're still planning to add 2d camera rotation as the boat rotates). (https://media.discordapp.net/attachments/1203246934471737414/1212884649072656414/woohoo_moving_with_fish_s.gif?ex=65f375da&is=65e100da&hm=f9638f43caeb2f01983dfbdb27a79f361f5925c012aead52dffc90b718817e48&=&width=1006&height=849)

### Changed
- Added ability to add and delete elements on the temp html copy per-user


## [0.0.6-dev] - 2024-03-03
### Changed
- First boat page visually improved (https://media.discordapp.net/attachments/1203246934471737414/1212525870959558706/image.png?ex=65f227b7&is=65dfb2b7&hm=f2e333da8fbc36f777f462084fef0eddca2fc972ef7f0ed0c6ce09c6c35e6aeb&=&format=webp&quality=lossless&width=747&height=849)
- We're starting to work with tutorial page (https://media.discordapp.net/attachments/1203246934471737414/1212525871261286450/image.png?ex=65f227b7&is=65dfb2b7&hm=6d26de7c5803ad3683b3d5cf89414e58edce2a7db83a07d20f817ac29ac447ad&=&format=webp&quality=lossless&width=969&height=849)


## [0.0.5-dev] - 2024-03-03
### Added
- Starting to add localizations to the main menu
- Added the first boat creation page

### Changed
- Big code rewrite and optimizations
- User level now getting from the database itself

### Fixed
- Fixed the problem with different emoji type. Now it look the same as inside discord


## [0.0.4-dev] - 2024-03-03
### Added
- Everything gets packed in their own module files. Like, colorthief and interaction collector.
- Added caching for colorthief performance increase

### Changed
- Browser now works better with multi-player tasks
- Added animated emoji when loading the page or restarting the game (https://media.discordapp.net/attachments/1203246934471737414/1211016677240610836/image.png?ex=65f5e4ab&is=65e36fab&hm=e39ebe884e202bc73ca226b2c0c79632b1e9a5ce33ba0a839e7f8cde5d1e4e84&=&format=webp&quality=lossless&width=972&height=199, https://media.discordapp.net/attachments/1203246934471737414/1211016676934688879/image.png?ex=65f5e4ab&is=65e36fab&hm=d5db37f397a83b36f6915f1c7947506d665789cb5669e1cd22984b1097c0530b&=&format=webp&quality=lossless&width=753&height=172, https://media.discordapp.net/attachments/1203246934471737414/1211016677542731826/image.png?ex=65f5e4ab&is=65e36fab&hm=eb114fc945500332edea6fee40c94a60d44ac6726a636d8c733347101ba9de63&=&format=webp&quality=lossless&width=961&height=217)

### Fixed
- Fixed browser closing when theres no active pages


## [0.0.3-dev] - 2024-03-03
### Added
- We're making the main menu of the game (https://media.discordapp.net/attachments/1203246934471737414/1209071673790173265/image.png?ex=65eed13e&is=65dc5c3e&hm=09d9b120218ab13e823e97fee9e32f8628a2aa209b4872ab4501954f1ce30ed7&=&format=webp&quality=lossless&width=544&height=525)

### Changed
- Main menu becomes visually better
- Added first interaction in the game. Now we can be in other page by clicking the button


## [0.0.2-dev] - 2024-03-03
### Added
- Added localization support for English, Russian, Ukraine.

### Changed
- Default data creation temporarily becomes a one more command


## [0.0.1-dev] - 2024-03-03
### Added
- Browser gets better. Not it sends sharper images of game and also have support of temporary copy of html file per-user.
- We're starting to use mongodb. Creates some schemas
- Before: https://media.discordapp.net/attachments/1203246934471737414/1205653082533531698/image.png?ex=65f4d66e&is=65e2616e&hm=f8590f8b64ef5e6b12b35ed6581ba8e1eadae87b805447e7596849f7e268b9fa&=&format=webp&quality=lossless&width=1542&height=724
- After: https://media.discordapp.net/attachments/1203246934471737414/1205653082835517441/image.png?ex=65f4d66e&is=65e2616e&hm=c8cf73d25741f7c9e1a0e120ac722393fbad11ecd5d305e6d79f57290e5c6ba8&=&format=webp&quality=lossless&width=1542&height=736