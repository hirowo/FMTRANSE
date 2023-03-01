//% weight=70 icon="\uf075" color=#33FF00 block="FMトランス"
namespace kagatranse {
    let mode: number;
    let ch: number;
    let pow = DigitalPin.P14;
    export class QN8027 {
        QN8027WReg(addr: number, cmd: number) {
            let buf: Buffer = pins.createBuffer(2);
            buf[0] = addr;
            buf[1] = cmd;
            pins.i2cWriteBuffer(0x2C, buf, false);
        }
        QN8027RReg(addr: number): number {
            let buf: Buffer = pins.createBuffer(1);

            buf[0] = addr;

            pins.i2cWriteBuffer(0x2C, buf, false);

            buf = pins.i2cReadBuffer(0x2C, 1, false);

            return buf[0];
        }
        QN8027Tune(mode: number) {
            if (mode == 1) {
                this.QN8027WReg(0, 0xc0);
                basic.pause(1);
                this.QN8027WReg(0, 0xd0);
                basic.pause(1);
                this.QN8027WReg(0, 0xc0);
                basic.pause(1);
            }
            else {
                this.QN8027WReg(0, 0x80);
                this.QN8027WReg(0, 0xa0);
                this.QN8027WReg(0, 0x80);

            }
        }

    }


    //% blockId=qn8027_init block="送信機初期化 "
    export function Initqn027(): void {
        let dsp = new QN8027;
 
        dsp.QN8027WReg(0x04, 0xD4);
        dsp.QN8027WReg(0x00, 0x31);
        //チャンネル
        dsp.QN8027WReg(0x01, 0x08);
        //パワー
        dsp.QN8027WReg(0x10, 0x48);

        mode = 1;

    }
    //% blockId=radio_off block="ラジオパワーダウン "
    export function off6955(): void {
        let dsp = new QN8027;
        dsp.QN8027WReg(0x00, 0x00);

    }

    //% blockId=radio_setfreq block="周波数%Freq |MHz"
    //% Freq.min=88.8f Freq.max=90.5f
    export function Set_Freq(Freq: number) {
        let dsp = new QN8027;
        ch = (Freq-88.8)*20;
        dsp.QN8027WReg(0x01, ch);
    }

    export enum radio_mode {
        //%block="音声"
        FM = 1,
        //%block="MP3"
        AM = 2
    }

    //% blockId=radio_Setmode block="モード %r_mode"
    export function Set_mode(r_mode: radio_mode) {
        mode = r_mode;
    }
    //% blockId=radio_setVol block="音量%vol"
    //% vol.min=0 vol.max=63
    export function Set_vol(vol: number) {
        let dsp = new QN8027;
        dsp.QN8027WReg(0x06, (vol << 2) | 0b0000001);
    }

}


