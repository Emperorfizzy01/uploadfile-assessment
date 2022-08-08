import { Injectable, NotFoundException } from '@nestjs/common';
import { VALIDITY_PERIOD } from '../config';
import { Errormessage } from '../Errormessage';
import {Buffer} from 'buffer';

@Injectable()
export class AppService {

  async getMime(mime: string): Promise<any> {
    try {
      if(mime) {
        const options = {
          currentTime: Date.now(),
          mimeType: mime
        }
        const token = Buffer.from(JSON.stringify(options)).toString('base64');
        return {
          accesstoken: token
        }
      } else {
        throw new NotFoundException(Errormessage.string)
      }
    } catch(err) {
      throw err
    }
  }


  async uploadFile(token: string, file: any): Promise<any> {
    try { 
      if(token) {
        const stringifyToken = Buffer.from(token, 'base64').toString('ascii');
        const decodedToken = JSON.parse(stringifyToken)
        if(Date.now() - decodedToken.currentTime > VALIDITY_PERIOD) throw new NotFoundException(Errormessage.InvalidToken)
        if(file.mimetype == decodedToken.mimeType) {
          return {
            responseCode: 200,
            uri: `localhost:3000/${file.filename}`
          }
        } else {
          throw new NotFoundException(Errormessage.mimeType)
        }
       
      }
    } catch(err) {
      throw err
    }
  } 
}
